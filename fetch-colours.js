import fetch from 'isomorphic-fetch';
import { writeFile, readFile, stat } from 'fs/promises';
import slugify from '@sindresorhus/slugify';
import { invertColor } from './utils.js';

async function fetchColors() {
  try {
    // any json parse error will also be caught
    const savedColors = await readFile('colors.json', 'utf8');
    console.log('using cached');
    return JSON.parse(savedColors);
  } catch(err) {}

  console.log('Fetching Fresh!')
  const res = await fetch('https://www.benjaminmoore.com/api/colors');
  const data = await res.json();
  // strip the keys and get an array of colors
  const colors = Object.values(data.colors);
  // write the response to a file so we don't have to nail their API
  await writeFile('colors.json', JSON.stringify(colors));
  return colors;
}

async function countColors() {
  const colors = await fetchColors();
  return colors.length;
}

async function familyColors() {
  const colors = await fetchColors();
  return colors.reduce((fams, color) => {
    const { family } = color;
    fams[family] = fams[family] || [];
    fams[family].push(color);
    return fams;
  }, {
    // Put these here so they go first, they look the best
    White: [],
    Blue: []
  });

}

function makeAGoodName(name) {
  return slugify(name.replace('\'',''));
}


async function generateCSSFile() {
  const colorsByfamily = await familyColors();
  // loop over each family and generate a css variable
  const css = Object.entries(colorsByfamily).map(([family, colors]) => {
    const header = /*css*/`/* \n\t ${family} \n\t*/`;
    const css = colors.map(color => {
      const { name, hex } = color;
      return `\t --${makeAGoodName(name)}: #${hex};`
    }).join('\n');
    return `${header}\n${css}`;
  }).join('\n\n');
  await writeFile('css/all.css', css);
}

async function generateHTMLViewer() {
  const colorsByfamily = await familyColors();
  const html = Object.entries(colorsByfamily).map(([family, colors]) => {
    const header = `<h2 id="${slugify(family)}">${family}</h2>`;
    const html = colors.map(color => {
      const { name, hex } = color;
      return `<div class="color" style="background-color: #${hex}">
        <p class="name" style="color: ${invertColor(hex, true)}">${name}</p>
        <button type="button" class="hex">--${makeAGoodName(name)}: #${hex};</button>
        <button type="button" class="variable">var(--${makeAGoodName(name)})</button>
      </div>`
    }).join('\n');
    return `
      <div class="family">
      ${header}
      ${html}
      </div>
    `;
  }).join('\n\n');

  // get the template
  const template = await readFile('./template.html', 'utf8');
  // replace the template with the html
  const templateHTML = template.replace('<!-- DUMP_ME_HERE -->', html);
  // write to disk
  await writeFile('./index.html', templateHTML);
}


generateCSSFile();
generateHTMLViewer();
