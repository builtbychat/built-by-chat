import assert from 'node:assert/strict';
import { livingDraft } from './living-draft.mjs';

const html=livingDraft({title:'Episode <script>alert(1)</script>',subtitle:'Verified & reviewed',storageKey:'test-safe-key',sections:[
  {id:'decision',label:'Audience decision',value:'Mosslight <wins>',help:'Verified only.'},
  {id:'learning',label:'What we learned',value:'Specific lesson.'}
]});

assert.match(html,/LIVING PRODUCTION ARTIFACT/);
assert.match(html,/ANTI-SLOP RELEASE GATE/);
assert.match(html,/Ready for human release review/);
assert.match(html,/Copy making receipt/);
assert.match(html,/localStorage/);
assert.match(html,/Episode &lt;script&gt;alert\(1\)&lt;\/script&gt;/);
assert.match(html,/Mosslight &lt;wins&gt;/);
assert.doesNotMatch(html,/<script>alert\(1\)<\/script>/);
assert.equal((html.match(/data-gate=/g)??[]).length,8);

console.log('Living publishing artifact passed: editable fields, local save, release gate, receipt copy, and HTML escaping.');
