from mcp.server.fastmcp import FastMCP

mcp = FastMCP("Python MCP Server")

@mcp.tool()
def get_employee_info(name: str) -> str:
    """
    Get Information about a given employee name :
    - name
    - salary
    """
    # Return a string instead of a dictionary
    return f"Employee: {name}, Salary: 50,000 MAD   "

if __name__ == "__main__":
    mcp.run()