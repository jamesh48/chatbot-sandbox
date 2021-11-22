module.exports = async (memberToPong) => {
  await memberToPong.react('🏓')
  await memberToPong.send('PONG!');
}