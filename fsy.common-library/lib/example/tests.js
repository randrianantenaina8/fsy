import {displayConstants, testAids, testRoles, testSession, testUsers} from "./testFunctions.js"

//TODO: set your local api url here
process.env.REACT_APP_PROJECT_API_URL = "http://scg.api/api"

console.log("============== Loading constants ==============")

displayConstants()

console.log("============== Testing session functions ==============")

const jwt = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2NjQ5NzMwMDAsImV4cCI6MTY2NDk4NzQwMCwiaWQiOiIxIiwiZmlyc3RuYW1lIjoiSm9obiIsIm5hbWUiOiJET0UiLCJwc2V1ZG8iOiJKRG9lIiwibWFpbCI6ImpvaG4uZG9lQG1haWwuY29tIiwiUk9MRSI6IltcIlJPTEVfVVNFUlwiXSJ9.jreJJZuX_E55BNYYs3VwoyhvLNJEWoKGfzhZw88tq8o"
const refreshToken = "5796e6f752ed03300203f1340864686da2780b92"
const user = {id: 1, firstname: "John", name: "DOE", pseudo: "JDoe", mail: "john.doe@mail.com"}
testSession(user, jwt, refreshToken)

console.log("============== Testing societies functions ==============")

testAids()

console.log("============== Testing users functions ==============")

testUsers()

console.log("============== Testing roles functions ==============")

testRoles()
