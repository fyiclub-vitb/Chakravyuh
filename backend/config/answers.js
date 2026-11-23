// Server-side answer checking.
// Correct answers live ONLY in the backend environment (backend/.env) and are
// never sent to the browser. Env vars are read lazily (at request time) so this
// module works regardless of when dotenv.config() runs.

const CITY_ORDER = ['Mumbai', 'Bangalore', 'Pune', 'Chennai', 'Jammu', 'Delhi'];

const env = (name) => {
    const value = process.env[name];
    if (value === undefined || value === '') {
        throw new Error(`Server misconfigured: ${name} is not set`);
    }
    return value;
};

const str = (v) => String(v ?? '').trim();
const lower = (v) => str(v).toLowerCase();
const noSpaces = (v) => lower(v).replace(/\s+/g, '');

// "15th August" and "15 august" are treated the same
const normDate = (v) => lower(v).replace(/(\d+)(st|nd|rd|th)/g, '$1').replace(/\s+/g, '');
// "11:00 PM" and "11 pm" are treated the same (minutes are ignored)
const normTime = (v) => lower(v).replace(/:\d{2}/g, '').replace(/\s+/g, '');

const checkers = {
    Mumbai: (a) => str(a.code) === env('MUMBAI_PASSCODE').trim(),

    Bangalore: (a) => str(a.code).toUpperCase() === env('BANGALORE_PASSCODE').trim().toUpperCase(),

    Pune: (a) => {
        const deviceId = env('PUNE_DEVICE_ID');
        const band = env('PUNE_FREQUENCY_BAND');
        const strength = env('PUNE_SIGNAL_STRENGTH');
        const delay = env('PUNE_DELAY_OFFSET');
        return (
            lower(a.deviceId) === lower(deviceId) &&
            str(a.frequencyBand) === band.trim() &&
            lower(a.signalStrength) === lower(strength) &&
            str(a.delayOffset) === delay.trim()
        );
    },

    Chennai: (a) => noSpaces(a.ngoName) === noSpaces(env('CHENNAI_NGO_NAME')),

    // Jammu is a Yes/No assessment. The correct answer defaults to "no".
    Jammu: (a) => lower(a.answer) === lower(process.env.JAMMU_CORRECT_ANSWER || 'no'),

    Delhi: (a) => {
        const city = env('DELHI_CITY');
        const date = env('DELHI_DATE');
        const time = env('DELHI_TIME');
        const places = env('DELHI_PLACES');
        return (
            lower(a.city) === lower(city) &&
            normDate(a.date) === normDate(date) &&
            normTime(a.time) === normTime(time) &&
            str(a.places) === places.trim()
        );
    }
};

// Cities where a wrong answer ends the game immediately
const DISQUALIFY_ON_WRONG = ['Jammu', 'Delhi'];

const checkAnswer = (city, answers) => checkers[city](answers || {});

module.exports = { CITY_ORDER, DISQUALIFY_ON_WRONG, checkAnswer };
