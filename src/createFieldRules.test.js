import { createFieldRules } from './createFieldRules';

describe('Component::base::Form::createFieldRules', () => {
  function myRule(values) {
    if (values.a === 1) {
      return { ...values, b: 2 };
    }

    return values;
  }

  function mySecondRule(values) {
    if (values.b === 2) {
      return { ...values, c: 3 };
    }

    return values;
  }

  function myThirdRule(values) {
    return values;
  }

  it('allows to create rules with 1 arg', () => {
    expect(() => createFieldRules(myRule)).not.to.throw(Error);
  });

  it('returns instance of function', () => {
    expect(createFieldRules(myRule)).to.be.instanceof(Function);
  });

  describe('with 1 arg', () => {
    let fieldRule;

    beforeEach(() => {
      fieldRule = createFieldRules(myRule);
    });

    it('evaluates the rule', () => {
      const obj = { a: 1, b: 0 };

      expect(fieldRule(obj)).not.to.be.equal(obj);
      expect(fieldRule(obj)).to.be.deep.equal({ a: 1, b: 2 });
    });

    it('evaluates the another rule', () => {
      const obj = { a: 2, b: 0 };

      expect(fieldRule(obj)).to.be.equal(obj);
      expect(fieldRule(obj)).to.be.deep.equal({ a: 2, b: 0 });
    });
  });

  describe('with 2 args', () => {
    let fieldRule;

    beforeEach(() => {
      fieldRule = createFieldRules(myRule, mySecondRule);
    });

    it('evaluates the rule', () => {
      const obj = { a: 1, b: 0, c: 0 };

      expect(fieldRule(obj)).not.to.be.equal(obj);
      expect(fieldRule(obj)).to.be.deep.equal({ a: 1, b: 2, c: 3 });
    });

    it('evaluates the 2nd rule', () => {
      const obj = { a: 0, b: 2, c: 0 };

      expect(fieldRule(obj)).not.to.be.equal(obj);
      expect(fieldRule(obj)).to.be.deep.equal({ a: 0, b: 2, c: 3 });
    });

    it('evaluates the 3rd rule', () => {
      const obj = { a: 2, b: 0, c: 0 };

      expect(fieldRule(obj)).to.be.equal(obj);
      expect(fieldRule(obj)).to.be.deep.equal({ a: 2, b: 0, c: 0 });
    });
  });

  describe('with array as 1st arg', () => {
    let fieldRule;

    beforeEach(() => {
      fieldRule = createFieldRules([myRule, mySecondRule]);
    });

    it('evaluates the rule', () => {
      const obj = { a: 1, b: 0, c: 0 };

      expect(fieldRule(obj)).not.to.be.equal(obj);
      expect(fieldRule(obj)).to.be.deep.equal({ a: 1, b: 2, c: 3 });
    });

    it('evaluates the 2nd rule', () => {
      const obj = { a: 0, b: 2, c: 0 };

      expect(fieldRule(obj)).not.to.be.equal(obj);
      expect(fieldRule(obj)).to.be.deep.equal({ a: 0, b: 2, c: 3 });
    });

    it('evaluates the 3rd rule', () => {
      const obj = { a: 2, b: 0, c: 0 };

      expect(fieldRule(obj)).to.be.equal(obj);
      expect(fieldRule(obj)).to.be.deep.equal({ a: 2, b: 0, c: 0 });
    });
  });

  describe('with array as 1st arg and multiple arguments', () => {
    let fieldRule;

    beforeEach(() => {
      fieldRule = createFieldRules([myRule, myThirdRule], mySecondRule);
    });

    it('evaluates the rule', () => {
      const obj = { a: 1, b: 0, c: 0 };

      expect(fieldRule(obj)).not.to.be.equal(obj);
      expect(fieldRule(obj)).to.be.deep.equal({ a: 1, b: 2, c: 3 });
    });

    it('evaluates the 2nd rule', () => {
      const obj = { a: 0, b: 2, c: 0 };

      expect(fieldRule(obj)).not.to.be.equal(obj);
      expect(fieldRule(obj)).to.be.deep.equal({ a: 0, b: 2, c: 3 });
    });

    it('evaluates the 3rd rule', () => {
      const obj = { a: 2, b: 0, c: 0 };

      expect(fieldRule(obj)).to.be.equal(obj);
      expect(fieldRule(obj)).to.be.deep.equal({ a: 2, b: 0, c: 0 });
    });
  });
});
