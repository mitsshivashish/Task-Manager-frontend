import React from "react"

const AvatarGroup = ({avatars, maxVisible = 3}) => {
  // Defensive: ensure avatars is always an array
  const safeAvatars = Array.isArray(avatars) ? avatars.filter(Boolean) : [];
  return (
    <div className="flex items-center">
      {safeAvatars.slice(0, maxVisible).map((avatar, index) => (
        avatar ? (
          <img
            key={index}
            src={avatar}
            alt={`Avatar ${index}`}
            className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0"
          />
        ) : null
      ))}
      {safeAvatars.length > maxVisible && (
        <div className="w-9 h-9 flex items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3">
          +{safeAvatars.length - maxVisible}
        </div>
      )}
    </div>
  )
}

export default AvatarGroup