
const wrap = (wrapped, wrapper) => {
  const startsWithBreak = wrapped[0] === '\n';
  const endsInBreak = wrapped.substring(wrapped.length - 1) === '\n';

  const pureStr = wrapped.substring(
    startsWithBreak ? 1 : 0,
    endsInBreak ? wrapped.length - 1 : wrapped.length
  );

  return `${startsWithBreak ? '\n' : ''}${wrapper}${pureStr}${wrapper}${endsInBreak ? '\n' : ''}`;
};

const blockStyles = [
  {
    name: 'Links',
    condition: (text, element) => element.textRun.textStyle.link,
    effect: (text, element) => {
      return `[${text}](${element.textRun.textStyle.link.url})`;
    },
  },

  {
    name: 'Bold Text',
    condition: (text, element) => element.textRun.textStyle.bold,
    effect: text => {
      return wrap(text, '**');
    },
  },

  {
    name: 'Italic Text',
    condition: (text, element) => element.textRun.textStyle.italic,
    effect: text => {
      return wrap(text, '*');
    },
  },

  {
    name: 'Underline Text',
    condition: (text, element) => element.textRun.textStyle.underline && !element.textRun.textStyle.link,
    effect: text => {
      return wrap(text, '_');
    },
  },
];

const parseElement = e => {
  let text = e.textRun.content;

  blockStyles.forEach(block => {
    text = block.condition(text, e) ? block.effect(text, e) : text;
  }, e);
  return text;
};

const parseParagraph = p => {
  if (p.paragraph) {
    return p.paragraph.elements.reduce((accumulator, current) => {
      return accumulator + parseElement(current);
    }, '');
  } else {
    return '';
  }
};

export default doc => {
  return doc.body.content.reduce((accumulator, current) => {
    return accumulator + parseParagraph(current);
  }, '').trim();
};
