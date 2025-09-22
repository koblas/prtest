#!/bin/bash

# Development setup script for the Todo App monorepo

set -e

echo "🚀 Setting up Todo App development environment..."

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v go &> /dev/null; then
    echo "❌ Go is not installed. Please install Go 1.19+ from https://golang.org/"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi

echo "✅ Prerequisites check complete"

# Setup backend
echo "🔧 Setting up backend..."
cd backend
go mod tidy
echo "✅ Backend dependencies installed"
cd ..

# Setup frontend
echo "🎨 Setting up frontend..."
cd frontend
npm install
echo "✅ Frontend dependencies installed"
cd ..

echo ""
echo "🎉 Setup complete! You can now run the application:"
echo ""
echo "  Backend (Terminal 1):"
echo "    cd backend && go run main.go"
echo ""
echo "  Frontend (Terminal 2):"
echo "    cd frontend && npm start"
echo ""
echo "  Then open http://localhost:3000 in your browser"
echo ""