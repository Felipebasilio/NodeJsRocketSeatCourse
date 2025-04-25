#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting documentation regeneration process...${NC}"

# Step 1: Check if we're in a Node.js project
if [ ! -f "package.json" ]; then
    echo -e "${RED}Error: Please run this script from your project's root directory${NC}"
    exit 1
fi

# Step 2: Unlink old version
echo -e "${YELLOW}Unlinking old version of DocMentor...${NC}"
npm unlink docmentor

# Step 3: Link to new version
echo -e "${YELLOW}Linking to latest DocMentor version...${NC}"
npm link docmentor

# Step 4: Generate documentation
echo -e "${YELLOW}Generating documentation...${NC}"
npx docmentor ./ --output ./docs --verbose

# Check if documentation was generated
if [ -d "./docs" ]; then
    echo -e "${GREEN}Documentation generated successfully!${NC}"
    echo -e "${YELLOW}Documentation location:${NC} ./docs"
else
    echo -e "${RED}Error: Documentation generation failed${NC}"
    exit 1
fi

# Optional: Open the docs directory in file explorer (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo -e "${YELLOW}Opening documentation directory...${NC}"
    open ./docs
fi 