#!/bin/bash
# ==========================================
# AI Grading System - Network Setup Script
# ==========================================
# This script automatically finds your IP and sets up the environment files

echo ""
echo "============================================"
echo "AI Grading System - Network Configuration"
echo "============================================"
echo ""

# Function to find IP address
find_ip() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        ifconfig | grep "inet " | grep -v 127.0.0.1 | head -n1 | awk '{print $2}'
    else
        # Linux
        hostname -I | awk '{print $1}'
    fi
}

# Get IP address
IP=$(find_ip)

# Check if IP was found
if [ -z "$IP" ]; then
    echo "ERROR: Could not find IPv4 address"
    echo "Please run 'ifconfig' (macOS) or 'hostname -I' (Linux) manually"
    exit 1
fi

echo "Your IP Address: $IP"
echo ""

# Create Backend .env file
echo "Creating Backend .env file..."
cat > Backend/.env << EOF
PORT=5000
NODE_ENV=development
FRONTEND_URLS=http://localhost:3000,http://$IP:3000
MONGODB_URI=mongodb://localhost:27017/ai-grading
JWT_SECRET=dev_secret_key_change_in_production
EOF

echo "✓ Backend .env created"

# Create Frontend .env.local file
echo "Creating Frontend .env.local file..."
cat > Frontend/.env.local << EOF
REACT_APP_API_URL=http://$IP:5000/api
REACT_APP_ENVIRONMENT=development
EOF

echo "✓ Frontend .env.local created"

echo ""
echo "============================================"
echo "Setup Complete!"
echo "============================================"
echo ""
echo "Your Network URLs:"
echo "  Local:   http://localhost:3000"
echo "  Network: http://$IP:3000"
echo ""
echo "Next steps:"
echo "  1. Open Terminal (Ctrl+Alt+T on Linux, Cmd+Space then Terminal on macOS)"
echo "  2. cd Backend && npm start"
echo "  3. Open another Terminal"
echo "  4. cd Frontend && npm start"
echo "  5. Access at http://$IP:3000 from other devices"
echo ""
