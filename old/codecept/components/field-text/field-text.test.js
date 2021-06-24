Feature('field-text');

Scenario('test field-text component', ({ I }) => {
    I.amOnPage('/tests/components/field-text/field-text.test.html')
    I.seeElementInDom('field-text')
});
