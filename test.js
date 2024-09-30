const countryCodes = ["us", "gb", "ca", "au", "de", "fr", "es", "it", "br", "pk"];

countryCodes.forEach(async (code) => {
  const response = await fetch(`https://staging.teuteuf-assets.pages.dev/data/worldle/puzzles/${code}.json`);
  const data = await response.json();
  console.log(data);
});
