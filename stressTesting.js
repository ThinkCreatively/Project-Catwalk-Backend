/* eslint-disable import/prefer-default-export */
import http from 'k6/http';
import { sleep, check } from 'k6';

// ==================================================
// ==================== GET REQS ====================
// ==================================================

export const options = {
  stages: [{ duration: '15s', target: 100 }]
};

export default function getReqTest() {
  const res = http.get('http://localhost:3000/api/qa/questions', 1);
  check(res, {
    'Is status 200?': (r) => r.status === 200,
    'Is response time < 2000ms': (r) => r.timings.duration < 2000
  });
  sleep(1);
}

// export default function getReqTest() {
//   const res = http.get('http://localhost:3000/api/qa/questions/1/answers');
//   check(res, {
//     'Is status 200?': (r) => r.status === 200,
//     'Is response time < 2000ms': (r) => r.timings.duration < 2000
//   });
//   sleep(1);
// }
