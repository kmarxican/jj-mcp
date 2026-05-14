# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT** open a public issue
3. Include:
   - Description of the vulnerability
   - Steps to reproduce (if applicable)
   - Potential impact
   - Suggested fix (if any)

## Response Timeline

- **Acknowledgment**: Within 48 hours
- **Assessment**: Within 1 week
- **Fix/Update**: Based on severity (critical: 1-2 weeks, high: 2-4 weeks)

## Security Considerations

This MCP server:
- Executes `jj` CLI commands via child_process
- Does not handle authentication credentials directly
- Runs with the same permissions as the host process
- Should only be used with trusted repositories

## Best Practices for Users

1. Keep `jj` CLI updated to latest stable version
2. Only use with repositories you trust
3. Verify the MCP server configuration
4. Report suspicious behavior immediately
