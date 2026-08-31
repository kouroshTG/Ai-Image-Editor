function OptionField({
  label,
  name,
  value,
  onChange,
  options,
}) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-bold text-gray-700">
        {label}
      </legend>

      <div className="space-y-2 ">
        {options.map((option) => {
          const isSelected = value === option.value

          return (
            <label
              key={option.value}
              className={
                'flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-200 ' +
                (
                  isSelected
                    ? 'border-purple-300 bg-purple-50 text-purple-700 shadow-sm'
                    : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-purple-200 hover:bg-white'
                )
              }
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={isSelected}
                onChange={(event) => {
                  onChange(event.target.value)
                }}
                className="h-4 w-4 accent-purple-600"
              />

              <span className="font-bold">
                {option.label}
              </span>
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}

export default OptionField