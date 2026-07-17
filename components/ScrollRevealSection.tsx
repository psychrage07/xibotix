'use client';

import MaskedReveal from './MaskedReveal';

interface Props {
  tag: string;
  title: string;
  body: string;
}

export default function ScrollRevealSection({ tag, title, body }: Props) {
  return (
    <div className="section__inner opacity-100 translate-y-0">
      <MaskedReveal delay={0}>
        <p className="section__tag">{tag}</p>
      </MaskedReveal>
      
      <MaskedReveal delay={150}>
        <h2
          className="section__title"
          dangerouslySetInnerHTML={{ __html: title }}
        />
      </MaskedReveal>
      
      <MaskedReveal delay={300}>
        <p className="section__body">{body}</p>
      </MaskedReveal>
    </div>
  );
}
