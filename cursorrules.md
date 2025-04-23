# Cursor Rules and Reminders

## PowerShell Command Syntax

- **DO NOT** use `&&` to chain commands in PowerShell as it's not supported
- Instead, use one of these approaches:
  1. Run commands sequentially on separate lines
  2. Use semicolons to separate commands: `command1; command2`
  3. Use the PowerShell pipeline operator where appropriate: `command1 | command2`
  4. For conditional execution, use: 
     - `command1; if ($?) { command2 }`

## Example

Instead of:
```
cd directory && npm run dev
```

Use:
```
cd directory
npm run dev
```

Or:
```
cd directory; npm run dev
``` 