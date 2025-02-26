# betterstack

Betterstack JavaScript libraries. 

## Install

```sh
npm install treeder/betterstack
```

## Usage

```js
let bsLogger = new BetterstackLogger({host: "abc.betterstackdata.com", token: "bstoken"})
bsLogger.log("hello world!")
bsLogger.log({message: "hello!"})
bsLogger.log(err)
bsLogger.log("uh oh", err)
bsLogger.log("This is some data:", {name: "John Wick"})
```
