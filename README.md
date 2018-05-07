# Against The Rage Machine

## Working the demo

When you load the demo page, you'll have to click the "Enable Feed" button *before* toggling the giant ON/OFF button in the corner. This is because, [in order to play a video](https://developers.google.com/web/updates/2017/09/autoplay-policy-changes), the user needs to interact with the page in some way.

### Sooo...environment issues totally suck right?
Based on this SO thread: https://stackoverflow.com/questions/34700610/npm-install-wont-install-devdependencies
I checked my local node production mode using:

```console
npm config get production
```

This was coming through as TRUE, in which case anything under devDependencies will not be installed. Running:

```console
npm config ls -l
```

Will show where/how this value was set to true. For me it was `/Users/<USERNAME>/.npmrc`

Clearing this file fixed EVERYTHING.

### SailsJS - NodeJS server wrapper documentation
a [Sails v1](https://sailsjs.com) application

Installation:
npm install sails -g (will do it globally)
(we've already created an app so you can skip that step)

go into the "against-the-rage-machine" folder inside 'server' and run
sails lift

you should be able to see it 

### Links

+ [Get started](https://sailsjs.com/get-started)
+ [Sails framework documentation](https://sailsjs.com/documentation)