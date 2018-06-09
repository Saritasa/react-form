import * as React from 'react';
import { shallow } from 'enzyme';

import { FormError } from './FormError';

describe('FormError', () => {
  function renderDoc(props = {}) {
    return shallow(<FormError {...props} />);
  }

  function Component({ children }) {
    return <small>{children}</small>;
  }

  it('does not throw an error', () => {
    expect(renderDoc).not.to.throw(Error);
  });

  it('renders nothing in case of empty errors object', () => {
    expect(renderDoc({}).isEmptyRender()).to.be.equal(true);
  });

  describe('without #component property', () => {
    it('renders error message in case of existed error', () => {
      expect(renderDoc({ error: 'my error message' }).text()).to.be.equal(
        'my error message',
      );
    });

    it('renders <div> in case of existed error', () => {
      expect(renderDoc({ error: 'my error message' }).is('div')).to.be.equal(
        true,
      );
    });
  });

  describe('with #component property = "p"', () => {
    it('renders error message in case of existed error', () => {
      expect(
        renderDoc({ error: 'my error message', component: 'p' }).text(),
      ).to.be.equal('my error message');
    });

    it('renders <p> in case of existed error', () => {
      expect(
        renderDoc({ error: 'my error message', component: 'p' }).is('p'),
      ).to.be.equal(true);
    });
  });

  describe('with #component property = Component', () => {
    it('passes error message as #children property in case of existed error', () => {
      const doc = renderDoc({
        error: 'my error message',
        component: Component,
      });

      expect(doc.prop('children')).to.be.equal('my error message');
    });

    it('renders Component in case of existed error', () => {
      const doc = renderDoc({
        error: 'my error message',
        component: Component,
      });

      expect(doc.is(Component)).to.be.equal(true);
    });
  });
});
