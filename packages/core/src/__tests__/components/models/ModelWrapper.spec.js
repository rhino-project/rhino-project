import React from 'react';
import renderer from 'react-test-renderer';
import ModelWrapper from 'rhino/components/models/ModelWrapper';

describe('ModelWrapper', () => {
  test(`wraps children in model classes`, () => {
    const component = renderer.create(
      <ModelWrapper baseClassName="bar" model={{ model: 'foo' }}>
        <p>wrapped</p>
      </ModelWrapper>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });

  test(`wraps children with custom wrapper`, () => {
    const customWrapper = ({ children }) => (
      <div className="foobar">{children}</div>
    );

    const component = renderer.create(
      <ModelWrapper
        baseClassName="bar"
        model={{ model: 'foo' }}
        wrapper={customWrapper}
      >
        <p>wrapped</p>
      </ModelWrapper>
    );
    expect(component.toJSON()).toMatchSnapshot();
  });
});
