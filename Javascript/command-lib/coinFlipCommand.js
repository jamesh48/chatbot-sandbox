module.exports = async (member) => {
  const x = Math.floor(Math.random() * 2) === 0;
  if (x) {
    await member.send("heads");
  } else {
    await member.send("tails");
  }
};
