#!/bin/bash

echo "Installing MwalaJS CLI..."
sudo cp dist/mwala-macos /usr/local/bin/mwala
sudo chmod +x /usr/local/bin/mwala
echo "Installation complete! Type 'mwala --help' to check."
