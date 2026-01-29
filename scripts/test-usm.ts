
import { system } from '../src/lib/usm/system';
import { ensureSubjectC } from '../src/lib/usm/processes/subject-c';
import { ensureDarkMatter } from '../src/lib/usm/processes/dark-matter';

console.log('Starting USM Test...');
ensureSubjectC();
ensureDarkMatter();

system.subscribe((msg) => {
    console.log('Broadcast received:', msg);
    if (msg.type === 'REALITY_UPDATE') {
        console.log('Reality validated. Exiting.');
        process.exit(0);
    }
});

// Timeout
setTimeout(() => {
    console.error('Timeout waiting for reality');
    process.exit(1);
}, 5000);
