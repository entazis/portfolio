#!/bin/bash
# Script to manage Prometheus HTTP Basic Authentication

NGINX_AUTH_DIR="/etc/nginx/auth"
PROMETHEUS_PASSWD_FILE="${NGINX_AUTH_DIR}/prometheus.htpasswd"

# Create auth directory if it doesn't exist
create_auth_dir() {
    if [ ! -d "$NGINX_AUTH_DIR" ]; then
        echo "Creating nginx auth directory: $NGINX_AUTH_DIR"
        sudo mkdir -p "$NGINX_AUTH_DIR"
        sudo chmod 755 "$NGINX_AUTH_DIR"
    fi
}

# Add or update a user
add_user() {
    local username=$1
    if [ -z "$username" ]; then
        echo "Usage: $0 add <username>"
        exit 1
    fi
    
    create_auth_dir
    
    if [ -f "$PROMETHEUS_PASSWD_FILE" ]; then
        echo "Adding/updating user: $username"
        sudo htpasswd "$PROMETHEUS_PASSWD_FILE" "$username"
    else
        echo "Creating new password file and adding user: $username"
        sudo htpasswd -c "$PROMETHEUS_PASSWD_FILE" "$username"
    fi
    
    sudo chmod 644 "$PROMETHEUS_PASSWD_FILE"
    echo "User $username added/updated successfully"
    echo "Note: You need to reload nginx for changes to take effect: sudo nginx -t && sudo systemctl reload nginx"
}

# Remove a user
remove_user() {
    local username=$1
    if [ -z "$username" ]; then
        echo "Usage: $0 remove <username>"
        exit 1
    fi
    
    if [ ! -f "$PROMETHEUS_PASSWD_FILE" ]; then
        echo "Password file does not exist: $PROMETHEUS_PASSWD_FILE"
        exit 1
    fi
    
    echo "Removing user: $username"
    sudo htpasswd -D "$PROMETHEUS_PASSWD_FILE" "$username"
    echo "User $username removed successfully"
    echo "Note: You need to reload nginx for changes to take effect: sudo nginx -t && sudo systemctl reload nginx"
}

# List users
list_users() {
    if [ ! -f "$PROMETHEUS_PASSWD_FILE" ]; then
        echo "Password file does not exist: $PROMETHEUS_PASSWD_FILE"
        exit 1
    fi
    
    echo "Users in Prometheus password file:"
    cut -d: -f1 "$PROMETHEUS_PASSWD_FILE"
}

# Show usage
usage() {
    echo "Prometheus Authentication Manager"
    echo ""
    echo "Usage: $0 <command> [options]"
    echo ""
    echo "Commands:"
    echo "  add <username>     Add or update a user"
    echo "  remove <username>  Remove a user"
    echo "  list               List all users"
    echo ""
    echo "Examples:"
    echo "  $0 add admin"
    echo "  $0 remove olduser"
    echo "  $0 list"
}

# Main script logic
case "$1" in
    add)
        add_user "$2"
        ;;
    remove)
        remove_user "$2"
        ;;
    list)
        list_users
        ;;
    *)
        usage
        exit 1
        ;;
esac
