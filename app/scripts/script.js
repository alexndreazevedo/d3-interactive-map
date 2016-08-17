const width = 960;
const height = 380;
const margin = {
  top: 20,
  left: 20,
  right: 20,
  bottom: 20,
};
const animation = 1000;
const board = {
  width: width - (margin.left + margin.right),
  height: height - (margin.top + margin.bottom),
};
const circleRound = 36;

const svg = d3.select('body')
  .append('svg')
    .attr('viewBox', [0, 0, width, height].join(' '))
    .attr('width', width)
    .attr('height', height)
  .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

const build = (dots, data) => {

  const xMin = d3.min(dots, d => d.x);
  const xMax = d3.max(dots, d => d.x);

  const yMin = d3.min(dots, d => d.y);
  const yMax = d3.max(dots, d => d.y);

  const xRange = board.width / (xMax - xMin);
  const yRange = board.height / (yMax - yMin);

  const scale = Math.min(xRange, yRange);

  const toScale = (d) => d * scale;
  const toRound = (d) => circleRound + (d * circleRound / 100);
  const delayAnimation = (d, i) => animation * i * 0.5;

  for (let dot of dots) {
    svg.append('circle')
      .attr('cx', toScale(dot.x))
      .attr('cy', toScale(dot.y))
      .attr('r', 1.25);
  }

  const circles = svg.append('g')
    .attr('class', 'circles');

  const circle = circles.selectAll('.circle')
    .data(data)
    .enter()
      .append('g')
      .attr('class', 'circle')
      .attr('transform', (d) => 'translate(' + toScale(d.position.x) + ', ' + toScale(d.position.y) + ')');

  circle.append('circle')
    .transition().ease(d3.easeBackOut).duration(animation).delay(delayAnimation)
      .attrTween('r', (d) => {

        const interpolate = d3.interpolate(0, toRound(d.percentual));

        return (t) => interpolate(t);
      });

  const content = circle.append('g')
    .attr('class', 'content')
    .attr('opacity', 0);

  content.transition().ease(d3.easeBackOut).duration(animation).delay(delayAnimation)
    .attrTween('opacity', (d) => {

      const interpolate = d3.interpolate(0, 1);

      return (t) => interpolate(t);
    });

  content.append('text')
    .attr('class', 'region')
    .text((d) => d.region);

  content.append('text')
    .attr('class', 'amount')
    .text((d) => d.amount + 'M');

  content.append('text')
    .attr('class', 'percentual')
    .text((d) => d.percentual + '%');

  circles.exit()
    .remove();
};

const data = [
  { region: 'EUROPE'    , amount: 419  , percentual: 55  , position: { x: 111.5, y: 11.5} },
  { region: 'CH'        , amount: 136.5, percentual: 18  , position: { x: 95.5, y: 27.5} },
  { region: 'N. AMERICA', amount: 121  , percentual: 16  , position: { x: 32.5, y: 23.5} },
  { region: 'APAC'      , amount:  64  , percentual:  8.5, position: { x: 160, y: 25} },
  { region: 'OTHER'     , amount:  17  , percentual:  2  , position: { x: 75, y: 85} },
];

d3.json('data/dots.json', (error, dots) => build(dots, data));
