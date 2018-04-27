# Against The Rage Machine

# Sooo...environment issues totally suck right?
Based on this SO thread: https://stackoverflow.com/questions/34700610/npm-install-wont-install-devdependencies
I checked my local node production mode using

npm config get production

This was coming through as TRUE, in which case anything under devDependencies will not be installed.

Running

npm config ls -l

Will show where/how this value was set to true. For me it was

/Users/<USERNAME>/.npmrc

Clearing this file fixed EVERYTHING.

## Other stuff (coming soon)