function EditorToolbar({
  tools,
  activeTool,
  onToolChange,
}) {
  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-3">
      {tools.map((tool) => {
        const Icon = tool.icon

        const isActive =
          activeTool === tool.id

        return (
          <button
            key={tool.id}
            type="button"
            onClick={() =>
              onToolChange(
                isActive ? null : tool.id,
              )
            }
            className={`flex flex-col items-center justify-center gap-1.5 rounded-2xl py-3 text-xs font-medium transition ${
              isActive
                ? 'bg-purple-100 text-purple-600'
                : 'bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
            }`}
          >
            <Icon size={20} />

            <span>
              {tool.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

export default EditorToolbar