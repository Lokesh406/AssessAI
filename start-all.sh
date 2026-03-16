#!/bin/bash
# ==========================================
# Start All Services Script
# ==========================================
# This script starts both Backend and Frontend in separate terminals

echo ""
echo "============================================"
echo "Starting AI Grading System"
echo "============================================"
echo ""

# Get IP address
if [[ "$OSTYPE" == "darwin"* ]]; then
    IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | head -n1 | awk '{print $2}')
else
    IP=$(hostname -I | awk '{print $1}')
fi

if [ -z "$IP" ]; then
    IP="localhost"
fi

echo "Your Network Address: http://$IP:3000"
echo "Local Address: http://localhost:3000"
echo ""

# Determine terminal command based on OS
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS - use open command to open Terminal
    echo "Starting Backend Server in new Terminal..."
    osascript -e "tell app \"Terminal\" to do script \"cd '$PWD/Backend' && npm start\""
    
    sleep 3
    
    echo "Starting Frontend Server in new Terminal..."
    osascript -e "tell app \"Terminal\" to do script \"cd '$PWD/Frontend' && npm start\""
else
    # Linux - use gnome-terminal or xterm
    echo "Starting Backend Server..."
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd Backend && npm start; bash"
    elif command -v xterm &> /dev/null; then
        xterm -e "cd Backend && npm start" &
    else
        echo "No terminal found. Please manually run:"
        echo "  cd Backend && npm start"
        exit 1
    fi
    
    sleep 3
    
    echo "Starting Frontend Server..."
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal -- bash -c "cd Frontend && npm start; bash"
    elif command -v xterm &> /dev/null; then
        xterm -e "cd Frontend && npm start" &
    fi
fi

echo ""
echo "============================================"
echo "Services Started!"
echo "============================================"
echo ""
echo "Backend:  http://localhost:5000"
echo "Frontend: http://localhost:3000 or http://$IP:3000"
echo ""
echo "Wait for both to fully load (15-30 seconds)"
echo "A browser window should open automatically"
echo ""
