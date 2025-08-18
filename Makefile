# Makefile for Chat API Service
# Uses Bun as the package manager and runtime

# Variables
BUN := bun
NODE := node
SRC_DIR := src
SCRIPTS_DIR := scripts
DIST_DIR := dist
BUILD_DIR := build

# Colors for output
GREEN := \033[0;32m
YELLOW := \033[1;33m
RED := \033[0;31m
NC := \033[0m # No Color

# Default target
.DEFAULT_GOAL := help

# Help target
.PHONY: help
help: ## Show this help message
	@echo "$(GREEN)Chat API Service - Available Commands:$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo ""

# Installation
.PHONY: install
install: ## Install dependencies using Bun
	@echo "$(GREEN)Installing dependencies with Bun...$(NC)"
	$(BUN) install
	@echo "$(GREEN)Dependencies installed successfully!$(NC)"

.PHONY: install-dev
install-dev: ## Install development dependencies
	@echo "$(GREEN)Installing development dependencies...$(NC)"
	$(BUN) install --dev
	@echo "$(GREEN)Development dependencies installed!$(NC)"

# Development
.PHONY: dev
dev: ## Start development server with hot reload
	@echo "$(GREEN)Starting development server...$(NC)"
	$(BUN) run dev

.PHONY: run
run: ## Run the application in production mode
	@echo "$(GREEN)Starting application...$(NC)"
	encore run

.PHONY: start
start: run ## Alias for run command

# Testing
.PHONY: test
test: ## Run tests
	@echo "$(GREEN)Running tests...$(NC)"
	$(BUN) run test

.PHONY: test-watch
test-watch: ## Run tests in watch mode
	@echo "$(GREEN)Running tests in watch mode...$(NC)"
	$(BUN) run test --watch

.PHONY: test-coverage
test-coverage: ## Run tests with coverage report
	@echo "$(GREEN)Running tests with coverage...$(NC)"
	$(BUN) run test --coverage

# Code Quality
.PHONY: lint
lint: ## Run linter (if configured)
	@echo "$(GREEN)Running linter...$(NC)"
	@if [ -f "eslint.config.js" ] || [ -f ".eslintrc.js" ] || [ -f ".eslintrc.json" ]; then \
		$(BUN) run lint; \
	else \
		echo "$(YELLOW)No linter configuration found. Skipping...$(NC)"; \
	fi

.PHONY: format
format: ## Format code (if prettier is configured)
	@echo "$(GREEN)Formatting code...$(NC)"
	@if [ -f ".prettierrc" ] || [ -f "prettier.config.js" ]; then \
		$(BUN) run format; \
	else \
		echo "$(YELLOW)No prettier configuration found. Skipping...$(NC)"; \
	fi

# Cleaning
.PHONY: clean
clean: ## Clean build artifacts and temporary files
	@echo "$(GREEN)Cleaning build artifacts...$(NC)"
	@rm -rf $(DIST_DIR) $(BUILD_DIR) .encore coverage .nyc_output
	@rm -rf node_modules/.cache
	@echo "$(GREEN)Clean completed!$(NC)"

.PHONY: clean-deps
clean-deps: ## Remove node_modules and lock files
	@echo "$(GREEN)Removing dependencies...$(NC)"
	@rm -rf node_modules
	@rm -f bun.lockb package-lock.json yarn.lock
	@echo "$(GREEN)Dependencies removed!$(NC)"

.PHONY: clean-all
clean-all: clean clean-deps ## Clean everything (build artifacts + dependencies)
	@echo "$(GREEN)Full clean completed!$(NC)"

# Comment Management
.PHONY: clean-comments
clean-comments: ## Remove multi-line comments from source code
	@echo "$(GREEN)Removing multi-line comments...$(NC)"
	$(NODE) $(SCRIPTS_DIR)/remove-comments.cjs $(SRC_DIR)

.PHONY: clean-comments-all
clean-comments-all: ## Remove multi-line comments from entire project
	@echo "$(GREEN)Removing multi-line comments from entire project...$(NC)"
	$(NODE) $(SCRIPTS_DIR)/remove-comments.cjs .

# Build (if needed for production)
.PHONY: build
build: ## Build the application for production
	@echo "$(GREEN)Building application...$(NC)"
	@if [ -f "tsconfig.json" ]; then \
		$(BUN) run build || echo "$(YELLOW)No build script found in package.json$(NC)"; \
	else \
		echo "$(YELLOW)No TypeScript configuration found. Skipping build...$(NC)"; \
	fi

# Health Check
.PHONY: health
health: ## Check application health (requires running server)
	@echo "$(GREEN)Checking application health...$(NC)"
	@curl -s http://localhost:4000/health || echo "$(RED)Health check failed. Is the server running?$(NC)"

# Environment Setup
.PHONY: setup
setup: install ## Complete project setup
	@echo "$(GREEN)Setting up project...$(NC)"
	@if [ ! -f ".env" ]; then \
		echo "$(YELLOW)Creating .env file from template...$(NC)"; \
		cp .env.example .env 2>/dev/null || echo "GROQ_API_KEY=your_api_key_here" > .env; \
	fi
	@echo "$(GREEN)Project setup completed!$(NC)"
	@echo "$(YELLOW)Don't forget to update your .env file with actual values!$(NC)"

# Docker support (optional)
.PHONY: docker-build
docker-build: ## Build Docker image
	@echo "$(GREEN)Building Docker image...$(NC)"
	@if [ -f "Dockerfile" ]; then \
		docker build -t chat-api-service .; \
	else \
		echo "$(RED)Dockerfile not found!$(NC)"; \
	fi

.PHONY: docker-run
docker-run: ## Run Docker container
	@echo "$(GREEN)Running Docker container...$(NC)"
	docker run -p 4000:4000 --env-file .env chat-api-service

# Utility targets
.PHONY: test-env
test-env: ## Test environment variable loading
	@echo "$(GREEN)Testing environment variables...$(NC)"
	$(NODE) scripts/test-env.js

.PHONY: logs
logs: ## Show application logs (if using PM2 or similar)
	@echo "$(GREEN)Showing logs...$(NC)"
	@tail -f logs/*.log 2>/dev/null || echo "$(YELLOW)No log files found$(NC)"

.PHONY: ps
ps: ## Show running processes
	@echo "$(GREEN)Running processes:$(NC)"
	@ps aux | grep -E "(encore|bun|node)" | grep -v grep || echo "$(YELLOW)No related processes found$(NC)"

.PHONY: version
version: ## Show version information
	@echo "$(GREEN)Version Information:$(NC)"
	@echo "Bun: $$($(BUN) --version 2>/dev/null || echo 'Not installed')"
	@echo "Node: $$($(NODE) --version 2>/dev/null || echo 'Not installed')"
	@echo "Encore: $$(encore version 2>/dev/null || echo 'Not installed')"

# Quick commands
.PHONY: quick-start
quick-start: install dev ## Quick start: install dependencies and run dev server

.PHONY: fresh-start
fresh-start: clean-all install dev ## Fresh start: clean everything, install, and run

# Make sure these targets don't conflict with files
.PHONY: all clean install run test build dev start