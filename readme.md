### What is this project ?
This is a full web application for research purpose.

It contains several measurements and a negotiation game.

The game currently is human vs. a scripted opponent.

### How to use it ?
1. Install node js.
2. Go to 'root/src' folder and open node js command window.
3. Type in 'node app'.


### About the system
#### File Structure
###### 'src' folder
* data_access (back end): data access objects.
* model (back end): models for the app.
* routes (back end): controller logic.
* utility (back end): basic utility functions like get time and logging.
* constants (back end): constants for back end.
* public (front end): everything in the front end.
  * assets: assets for the pages, stylesheet, images, fonts etc.
  * views: dynamic pages.
  * view_model: view model for the pages.
  * initializer: initializer for the pages.
  * model: front end models for the pages.
  * constants (front end): constants for front end.
  * utility (front end): basic utility functions like get time and logging.

#### Some custom standards used in the app
###### page loading / routing (front/back end)
Http request form contents / page loading content from http request:
  * from
  * user_id
  * page specific data, for example:
    * questionnaire_data
    * quiz_data
    * player_role
    * game_data
    * reward_code

###### Logging (front/back end)
General logging format:
- '[function name] [type]: [log content]'
- type: '', 'error/err', 'warning'

Back end logging:
- Log routing behavior and general data flow in the back end.
  - from: which page gets here.
  - to: which page this routes is going.
  - tip: what database/model is updated etc..

Front end logging:
- Log user general page behavior.
- Log user in game page behavior.

###### Game page
- Item locations format: {category: [list of integer]}
- Actions
- Views

###### Font (front end)
- Default: 'George' for questions and study.
- Others: 'font-family: Lato' for others.

###### Aws dynamo database (back end)
* Table 'auction-war-solo-users', all cell type are string.
  * user_id: key
  * questionnaire: attribute
    * format:
    ```
    {
      'study no.': {
        'answer number': 'answer value';
      }
    }
    ```
  * role: attribute
    * format: 'type-0', 'type-1' etc.
  * game: attribute
  * reward: attribute

* putItem
    ```
    var param = {
      TableName: 'auction-war-solo-users',
      Item: {
        user_id: {S: user_id},
        questionnaire: {S: '*'},
        role: {S: '*'},
        quiz: {S: '*'},
        game: {S: '*'},
        reward: {S: '*'}
      },
    }
    ```

* deleteItem
    ```
    var param = {
      TableName: 'auction-war-solo-users',
      Key: {
        user_id: {
          S: user_id,
        }
      },
    }
    ```

* getItem
    ```
    var param = {
      TableName: 'auction-war-solo-users',
      Key: {
        user_id: {
          S: user_id,
        }
      },
      AttributesToGet: attributes,
    }
    ```

* updateItem
    ```
    var param = {
      TableName: 'auction-war-solo-users',
      Key: {
        user_id: {
          S: user_id,
        }
      },
      AttributeUpdates: attribute_keys,
    }
    ```

### Todo feature list
- [x] Look into how to extract data from database. Currently not very clean.
    ```
    User.prototype.LoadData = function (data) {
      this.cache['questionnaire'] = data['Item']['questionnaire']['S'];
      this.cache['role'] = data['Item']['role']['S'];
      this.cache['quiz'] = data['Item']['quiz']['S'];
      this.cache['game'] = data['Item']['game']['S'];
      this.cache['reward'] = data['Item']['reward']['S'];
    }
    ```
  *Solution:* Moved this piece of logic into database.

- [x] Put user.log outside user model and into logger.Log, add log
      to file function.

  *Solution:* Moved this piece of logic into logger.

- [ ] Finish initializer_questionnaire/IsAnswerCompleted.

- [ ] Uncomment initializer_quiz/IsSubmitDataValid.

- [ ] Look into game timer, not very accurate.

- [ ] Start putting comments into the code wherever it's necessary and
      export them use jsdoc.

- [ ] Gradually writing front end pages into ko view model instead of jquery.

- [ ] Add unit test.

- [ ] Add integration test.

- [ ] Different browser support.

- [ ] Add admin page as tools for the app with authentication (optional).

- [ ] Looking into session cache for better performance (optional).

- [ ] Integrating human vs human app.

- [ ] Developing human vs ai app.
  - What's missing in this human vs scripted game technically are:
    - Socket.
    - Manager game and game model (to match with back end model).
    - Table game in database.
    - Table users missing type (ai, human) field.


### Appendix
#### Notes
* Form data is used to communicate between front end and back end.
  - Restful API is not used since this web app is not a service.

* AWS DynamoDB doesn't support emtpy string as input (11/18/2015).

* Database cell all uses string which contains JSON objects.
  - Note that for some other databases, JSON objects don't have to be
    serialized but directly passed.

* Understanding the web app architecture in great granuality.
  - Model: model for back end.
  - Control: routing.
  - View: abstract view that fits into MVC framework, can be furthur
          divided into follow components.
    - View Model: view model for front end page.
    - Model: front end model, which sometimes is coupled with backend model
             it can be either static model or not.
    - View: actually view

* Game page color coding.
  - Black: just plain text
  - Blue: game state
  - Red: important / warning / error
  - Green: correct

* Javascript binding lost can happen pretty frequently, in which case,
  'this' cannot be used.
  - 'self' vs 'this': http://alistapart.com/article/getoutbindingsituations

* Code style currently follows C++ style guide instead of javascript
  style guide.

* Javascript circular dependencies:
  http://stackoverflow.com/questions/10869276/how-to-deal-with-cyclic-dependencies-in-node-js

* Knockout js:
  - ko table cannot be bundled on tr (11/18/2015).
  - View model is able to emit event.

* Circular reference json: http://makandracards.com/makandra/28847-dealing-with-typeerror-converting-circular-structure-to-json-on-javascript

* Game scene animation is cancelled for code simplicity.

* Game page has a lot of components inside. There's two way to communicate
  between these components. One is to use subscription pattern, but it can be
  messy and hard to know what's happending underneath. The other one is to use
  mediator pattern, which is what's used here.
