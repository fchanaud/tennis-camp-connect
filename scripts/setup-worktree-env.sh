#!/bin/bash
# This script creates symlinks for .env.local in Cursor worktrees
# Run this script whenever Composer creates new worktrees

WORKTREE_BASE="$HOME/.cursor/worktrees/tennis-camp-connect"
MAIN_PROJECT="$HOME/Desktop/project/applications/tennis-camp-connect"

if [ ! -f "$MAIN_PROJECT/.env.local" ]; then
    echo "❌ Error: .env.local not found in main project at $MAIN_PROJECT"
    exit 1
fi

echo "🔗 Setting up .env.local symlinks in worktrees..."
echo "Main project: $MAIN_PROJECT"
echo "Worktree base: $WORKTREE_BASE"
echo ""

if [ ! -d "$WORKTREE_BASE" ]; then
    echo "⚠️  Worktree directory not found: $WORKTREE_BASE"
    echo "   This is normal if no worktrees have been created yet."
    exit 0
fi

# Find all worktrees and create symlinks
FOUND=0
for worktree in "$WORKTREE_BASE"/*; do
    if [ -d "$worktree" ]; then
        FOUND=1
        if [ -L "$worktree/.env.local" ]; then
            echo "✓ Symlink already exists: $(basename $worktree)"
        elif [ -f "$worktree/.env.local" ]; then
            echo "⚠️  File exists (not a symlink): $(basename $worktree)"
            echo "   To replace with symlink, run: rm $worktree/.env.local && ./scripts/setup-worktree-env.sh"
        else
            ln -s "$MAIN_PROJECT/.env.local" "$worktree/.env.local"
            if [ $? -eq 0 ]; then
                echo "✓ Created symlink for: $(basename $worktree)"
            else
                echo "❌ Failed to create symlink for: $(basename $worktree)"
            fi
        fi
    fi
done

if [ $FOUND -eq 0 ]; then
    echo "⚠️  No worktrees found in $WORKTREE_BASE"
    echo "   Run this script again after Composer creates worktrees."
fi

echo ""
echo "✅ Done!"

