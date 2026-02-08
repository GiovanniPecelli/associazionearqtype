export function DatePicker({ value, onChange, label, required = false, min }) {
    // Format date for input (YYYY-MM-DD)
    const formatDate = (date) => {
        if (!date) return ''
        const d = new Date(date)
        return d.toISOString().split('T')[0]
    }

    // Handle change
    const handleChange = (e) => {
        const dateValue = e.target.value
        if (dateValue) {
            // Convert to ISO string for storage
            const isoDate = new Date(dateValue).toISOString()
            onChange(isoDate)
        } else {
            onChange(null)
        }
    }

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-300 mb-1">
                    {label} {required && <span className="text-red-400">*</span>}
                </label>
            )}
            <input
                type="date"
                value={formatDate(value)}
                onChange={handleChange}
                min={min || formatDate(new Date())}
                required={required}
                className="w-full px-4 py-2 border border-white/10 bg-black/20 text-white rounded-lg focus:ring-2 focus:ring-primary-500/50 focus:border-transparent"
            />
        </div>
    )
}
