import {
  Check,
  User,
  Package,
  Trees,
  Sparkles,
  Pencil,
  WandSparkles,
  Palette,
  Image,
  Camera,
  Sun,
  CloudSun,
  Zap,
  SlidersHorizontal,
} from 'lucide-react'

const categoryOptions = [
  {
    value: 'product',
    label: 'محصول',
    icon: Package,
  },
  {
    value: 'person',
    label: 'شخص',
    icon: User,
  },
  {
    value: 'environment',
    label: 'محیط',
    icon: Trees,
  },
  {
    value: 'other',
    label: 'سایر',
    icon: Sparkles,
  },
]

const typeOptions = [
  {
    value: 'edit',
    label: 'ویرایش تصویر',
    icon: Pencil,
  },
  {
    value: 'enhance',
    label: 'بهبود تصویر',
    icon: WandSparkles,
  },
  {
    value: 'restyle',
    label: 'تغییر سبک',
    icon: Palette,
  },
  {
    value: 'background',
    label: 'تغییر پس‌زمینه',
    icon: Image,
  },
]

const styleOptions = [
  {
    value: 'realistic',
    label: 'واقع‌گرایانه',
    icon: Camera,
  },
  {
    value: 'professional',
    label: 'حرفه‌ای',
    icon: Sparkles,
  },
  {
    value: 'cinematic',
    label: 'سینمایی',
    icon: Image,
  },
  {
    value: 'artistic',
    label: 'هنری',
    icon: Palette,
  },
]

const lightingOptions = [
  {
    value: 'natural',
    label: 'نور طبیعی',
    icon: Sun,
  },
  {
    value: 'studio',
    label: 'نور استودیویی',
    icon: Camera,
  },
  {
    value: 'soft',
    label: 'نور نرم',
    icon: CloudSun,
  },
  {
    value: 'dramatic',
    label: 'نورپردازی دراماتیک',
    icon: Zap,
  },
]

const editStrengthOptions = [
  {
    value: 'subtle',
    label: 'تغییر جزئی',
    icon: SlidersHorizontal,
  },
  {
    value: 'moderate',
    label: 'تغییر متوسط',
    icon: SlidersHorizontal,
  },
  {
    value: 'significant',
    label: 'تغییر زیاد',
    icon: Zap,
  },
]

function OptionCards({
  label,
  value,
  onChange,
  options,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <div
        className={`
          grid grid-cols-2 gap-2
          ${
            options.length === 5
              ? 'sm:grid-cols-5'
              : 'sm:grid-cols-4'
          }
        `}
      >
        {options.map((option) => {
          const Icon = option.icon
          const isSelected =
            value === option.value

          return (
            <button
              key={option.value}
              type="button"
              onClick={() =>
                onChange(option.value)
              }
              className={`
                group relative flex min-h-[72px]
                flex-col items-center justify-center
                gap-2 overflow-hidden rounded-xl
                border px-3 py-3 text-xs font-bold
                transition-all duration-200
                active:scale-[0.98]

                ${
                  isSelected
                    ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-md shadow-purple-100 ring-2 ring-purple-100'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:-translate-y-0.5 hover:border-purple-300 hover:bg-white hover:text-purple-600 hover:shadow-sm'
                }
              `}
            >
              {/* Check */}
              <span
                className={`
                  absolute right-2 top-2
                  flex h-5 w-5 items-center
                  justify-center rounded-full
                  bg-purple-600 text-white
                  transition-all duration-200
                  ${
                    isSelected
                      ? 'scale-100 opacity-100'
                      : 'scale-50 opacity-0'
                  }
                `}
              >
                <Check
                  size={12}
                  strokeWidth={3}
                />
              </span>

              {/* Icon */}
              <span
                className={`
                  transition-all duration-200
                  ${
                    isSelected
                      ? 'scale-110 text-purple-600'
                      : 'text-gray-400 group-hover:scale-105 group-hover:text-purple-500'
                  }
                `}
              >
                <Icon
                  size={21}
                  strokeWidth={
                    isSelected ? 2.5 : 2
                  }
                />
              </span>

              {/* Label */}
              <span>
                {option.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function PromptOptions({
  category,
  setCategory,
  type,
  setType,
  optionOne,
  setOptionOne,
  optionTwo,
  setOptionTwo,
  optionThree,
  setOptionThree,
  description,
  setDescription,
}) {
  return (
    <div className="space-y-6">

      {/* Category */}
      <OptionCards
        label="دسته‌بندی"
        value={category}
        onChange={setCategory}
        options={categoryOptions}
      />

      {/* Request Type */}
      <OptionCards
        label="نوع درخواست"
        value={type}
        onChange={setType}
        options={typeOptions}
      />

      {/* Style */}
      <OptionCards
        label="سبک تصویر"
        value={optionOne}
        onChange={setOptionOne}
        options={styleOptions}
      />

      {/* Lighting */}
      <OptionCards
        label="نورپردازی"
        value={optionTwo}
        onChange={setOptionTwo}
        options={lightingOptions}
      />

      {/* Edit Strength */}
      <OptionCards
        label="میزان تغییر"
        value={optionThree}
        onChange={setOptionThree}
        options={editStrengthOptions}
      />

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="mb-2 block text-sm font-bold text-gray-700"
        >
          توضیحات
        </label>

        <textarea
          id="description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          placeholder="توضیحات یا درخواست‌های اضافی خود را وارد کنید..."
          rows={4}
          className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-7 text-gray-700 outline-none transition-all duration-200 placeholder:text-gray-400 hover:border-purple-300 hover:bg-white focus:border-purple-500 focus:bg-white focus:ring-4 focus:ring-purple-100"
        />
      </div>
    </div>
  )
}

export default PromptOptions