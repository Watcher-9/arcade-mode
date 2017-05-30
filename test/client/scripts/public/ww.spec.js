// // worker.js
// // =========
//
// // Using a webworker ensures that this code does not have access to the global context
//
// 'use strict';
//
// // used require because import didn't work
// /* eslint no-unused-vars: 0 */
// const assert = require('chai').assert;
//
// onmessage = e => {
//   const userCode = e.data[0];
//   const currChallenge = e.data[1];
//
//   const tests = currChallenge.challenge.tests.map(test => (
//     {
//       test,
//       // testCondition: test.match(/^assert\(([^,]*),/)[1],
//       testMessage: test.match(/message: (.*)'\);$/)[1]
//     }
//   ));
//
//   // append user code output to final object passed back via postMessage:
//   // if user output does not run, then tests should not be executed.
//   const userOutput = [];
//   const userFnData = { error: null, pass: true, output: '' };
//   try {
//     const val = eval(`${userCode}`);
//   }
//   catch (err) {
//     console.log(`err: ${err}`);
//     userFnData.error = err.toString();
//     userFnData.pass = false;
//     userFnData.output = err.toString();
//     userOutput.push(userFnData);
//
//     return postMessage(userOutput);
//   }
//
//   if (eval(`${userCode}`) === undefined) {
//     userFnData.output = 'User output is undefined';
//   }
//   else {
//     userFnData.output = JSON.stringify(eval(`${userCode}`), null, 2);
//   }
//   userOutput.push(userFnData);
//
//   const testResults = [];
//   tests.forEach(test => {
//     const testRunData = { error: null, pass: true };
//     try {
//       const val = eval(
//         `${userCode} // User code
//         ${test.test} // Test case code
//         `
//       );
//     }
//     catch (err) {
//       console.log(`Test Error: ${err}`);
//       testRunData.error = err;
//       testRunData.pass = false;
//     }
//     testResults.push(testRunData);
//   });
//
//   const postData = userOutput.concat(testResults);
//
//   console.log('Now sending worker user code output and test results');
//   postMessage(postData);
//
//   /*
//   // Solution #1: Append 'return' and construct a new Function, then call that function.
//   const reFn = e.data.replace(Challenges.challenges[0].challengeSeed[0],
//     `return ${Challenges.challenges[0].challengeSeed[0]}`);
//
//   const userFn = (new Function(reFn))();
//   console.log(userFn('test string')); // passing an argument to the user function
//
//   // single test case:
//   const testCase = `${assert};${e.data};return ${tests[0].test}`;
//   const tc = (new Function(testCase))();
//   console.log(`assert single test case: ${tc}`);
//
//   // multiple test cases in one:
//   const reTestCases = tests.map(test =>
//     `${assert};
//     ${e.data};
//    // console.log(${test.testCondition} ${test.testMessage});
//     return ${test.test}`);
//
//   const assertFns = reTestCases.map(reTestCase => (new Function(reTestCase))());
//   // console.log('assert: ' + assertFns);
//   assertFns.map(assertFn => console.log(`assert all: ${assertFn}`));
//
//   // Solution: #2: Append the test case to the end the code below:
//
//   // console.log('eval: ' + eval(testCase));
//
//   // const testACase = eval((function () { return testCase; })());
//
//   // console.log('test: ' + testACase);
//   */
// };
//
// // postMessage(runTestsAgainstUserCode());
// // onmessage = e => { console.log(e); };
//
// /*
// function assert (condition, message) {
//   if (!condition) {
//     //message = message || 'Assertion failed';
//     //if (typeof Error !== 'undefined') {
//       //throw new Error(message);
//     //}
//     //throw message;
//     //
//     return false;
//   }
//   return true;
// }
// */
//

/* Unit tests for file client/scripts/public/worker.js. */
import { expect } from 'chai';

import Challenges from '../../../../public/json/challenges-algorithms.json';

const Worker = require('tiny-worker');

describe('Web Worker', () => {
  it('should return correctly', () => {
    const promise = new Promise(res => {
      // const dummyWorker = new Worker('./client/scripts/public/worker.js');
      // both versions work now.
      const dummyWorker = new Worker('./public/js/ww.bundle.js');

      dummyWorker.onmessage = e => {
        res(e.data);
      };

      dummyWorker.postMessage(['var re = /^([+]?1[\\s]?)?((?:[(](?:[2-9]1[02-9]|[2-9][02-8][0-9])[)][\\s]?)|(?:(?:[2-9]1[02-9]|[2-9][02-8][0-9])[\\s.-]?)){1}([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2}[\\s.-]?){1}([0-9]{4}){1}$/; function telephoneCheck(str) { return re.test(str); } telephoneCheck("555-555-5555");', Challenges.challenges[0]]);
    });
    return promise
    .then(workerData => {
      expect(workerData[0]).to.equal('true');
      expect(workerData.slice(1)).to.have.length(27);
      // no need to catch errors as the errors propogate to mocha to display
    });
  });
});
