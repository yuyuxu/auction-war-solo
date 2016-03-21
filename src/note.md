### Todo feature list

- [ ] Finish initializer_questionnaire/IsAnswerCompleted.

- [ ] Uncomment initializer_quiz/IsSubmitDataValid.

- [ ] Look into game timer, not very accurate. Aslo timer should be an object rather than a static model.

- [ ] Gradually writing front end pages into ko view model instead of jquery.

- [ ] Add unit test.

- [ ] Add integration test.

- [ ] Different browser support.

- [ ] Constants need to be inside a model.

- [ ] Embedded game app is still messy. Need a ManagerView as mediator to control rendering from both web page and game scene.

- [ ] Performance of the code and game code. https://www.mnot.net/cache_docs/.

- [ ] Fixing human vs human app and integrate with solo app.


### Notes
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

* Game page has a lot of components inside. There's two way to communicate
  between these components. One is to use subscription pattern, but it can be
  messy and hard to know what's happending underneath. The other one is to use
  mediator pattern, which is what's used here.
