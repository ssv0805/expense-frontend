

function Avatar({ name = "User" }) {
  const getInitials = (fullName) => {
    const words = fullName.trim().split(" ").filter(Boolean);

    if (words.length === 1) {
      return words[0][0].toUpperCase();
    }

    return (words[0][0] + words[1][0]).toUpperCase();
  };

  return (
    <div className="avatar">
      {getInitials(name)}
    </div>
  );
}

export default Avatar;