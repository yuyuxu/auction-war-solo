Tech Notes:
- Tried using node fiber for async, give assertion error.
- For including other files, client models uses dynamic script loading; server models uses export method.
- I'm using Module to a) related similar functions b) create singleton; all others use class and objects.
- AWS DynamoDB doesn't seem to support emtpy string as input. [Need to check in detail]
- To solve callback hell problem, I'm using modulization to relieve the pain.
? I'm still very confused about module and class and object in javascripts.
- I'm not using restful API in this application, all the data are embedded in req.body
-> Add database data checking function.
? http://stackoverflow.com/questions/7042340/node-js-error-cant-set-headers-after-they-are-sent
-> vmodel_questionnaire logic should be improved
- Controller is divided into 3 parts and always should do a lot of error checking
	get request data: always contain turker id and from
	update model
	update database / routing
- Current request contains following keyword:
	user_id
	from
	test_name
	questionnaire_data
	player_side
	quiz_data
	game_data
	reward_code
- To ensure consistency, I'm making database initial into '*'
? Controller part can be improved more, but so far it's fine (separate out some functions)
? Do people use == or === professionally
? What exactly is the right way to write modules (client vs backend)
? How to separate object logic and object rendering: I'm using 'composition' here
? Ideally I should separate game sender out from ModuleGame and counter from ModuleGameRendering
- Color coding:
	Black: just plain text
	Blue: game state
	Red: important / warning / error
	Green: correct one
- About javascript scope vs context vs closure
? What is a proper way to write socket io on server side
-> How to resolve circular dependencies?
	http://stackoverflow.com/questions/10869276/how-to-deal-with-cyclic-dependencies-in-node-js
-> Naming convention : variable of required package should be all capital cases
--> So far all the id with dummy_ means testing cases
- About refresh: as long as the server side script doesn't change, refresh works
--> Game layout: try using panel
- Rethink about testing framework (how the messages flow)
	? Sometimes you just have to use Restful (Rethink about it)
	- right now I'm using url to pass testing parameters, ideally it should be passed via restful url
	- should really separate the testing code outside, together with organize files inside view_model file (rename or whatever)
!!! Delete "// Debug: " after done
-> Refactor all the controllers and Game logics, it's getting messy
!!! Please, either use user_id or player_id
? Logic about ManagerSocket doesn't seem to be efficient.
- Note that in socket io, I didn't trust global variable, everything is recorded in a map with key socket.id
-- So far I'm logging in two ways:
	1. user specific activity (with time), including: controller information, game information (this is intentional redundant data)
	2. game specific data, including: game actions
-- Logging format:
 	time, type, data
 		type: controller, socket, game
		data: at, to
-- Controller signal format (use ':', '-')
	status:ques, status:finish, status:introduction
	db:no-player
	error:ques
-- Error logging format
	[] * : &
	[]: indicate action
	* : indicate where
	& : indicates error message
??? So far I'm creating game dynamically, over generate game then delete, should I just create game that's needed?

--- For now just use ClientLog, it should be refactored
--- As long as the server doesn't crash, it will contain all the variables as well as ejs variables,
--- What about socket: socket id is still there, but the logic is completely messed up unless add another manager for socket, so just add protection on client side
--- Used to have 'Can't set header' Issuse
??? Still need to learn about communication behavior coding
--- refactor data_access module
@@@@ I'm really annoyed by javascript promp window
--- Profiling: StrongLooop. Concurix. New Relic. APM
.... Right now the alert windows are not consistent not sure what to do
--- Current web doesn't support multiple platform browser
--- Right now I'm using ajax from window.onbeforeunload to unregister user
??? Protocol for SetGameStatus needs to be refactored

Some important Bugs and Fixes that's done~
- Accept button should disappear after item is moved, otherwise it would make the items incorrect
- Add alert for start turn
- Mention in Mturk the required browser is Chrome!!

--------------
What needs to be done?
- Uncomment questionnaire data
- Uncomment all the Debug
- Change bunyan logging level
- Change Client logging level
- Add authentification to admin
- Add some statistics to admin



TODO: -----
- How to extract data from database
User.prototype.LoadData = function (data) {
  this.cache['questionnaire'] = data['Item']['questionnaire']['S'];
  this.cache['role'] = data['Item']['role']['S'];
  this.cache['quiz'] = data['Item']['quiz']['S'];
  this.cache['game'] = data['Item']['game']['S'];
  this.cache['reward'] = data['Item']['reward']['S'];
}

- How to think about modules in front/back end (mvc vs mvvm)
like namespace or package, really should always define module if needed.
although module looks slightly different in front end and back end.
front end module is like a namespace, "conventionly" defined directly use a map object, because front end script is loaded as public
back end module is defined as a package and exported as a module

- ko table cannot bind on tr?

- note
now the view model is able to emit checked event
now it's completly event based code for view model, so code is cleaner
as before the answers were collected when next button is clicked (half even driven)

- self vs this
http://alistapart.com/article/getoutbindingsituations
where's the problem?
this.Select = function(question, choice) {
  select_cb(question['category'], question['count'], choice['choice_text']);
  return true;
}

- database
note that I'm using string for all the database cell data type and usually it's serialization of json object so that format is all organized and standardalized
maybe i should abstract database api more, especially the get and set attributes functions are the same because the all the entries are string

- request / dataflow
really should be using restful api instead of currently using form submit (and ajax)
write down the dataflow of my app, also think about all the possible way of handling this and their pros and cons

- standards
this web application has certain protocols and standards I made up, I'm not sure if this is the right way of doing things

- how to test it and how to add an admin page

- about the pages
quiz and introduction pages are more like completely static page
questionnaire is view model page
but really all the static pages shoudl be writen in view model to separate out the interaction and content, instead of now using jquery
so far the way ejs get data from model doesn't look right to be mvc or mvvm
quiz page really can use questionnaire

- actual game logic
when to assign role
ai
change the text on the introduction page

- log
shouldn't user.log be outside of user model

- please start putting comments
/**
 * This module is the game manager
 *  - maintain game global variables
 *  - manage flow of game
 * Notes about reset:
 *  - ResetTimer (reset game state message)
 *  - ResetInterface (reset css, html controllers)
 *  - ResetTurn (reset in game variables)
 */

- about game
right now i'm using mvc framework for the game front end, the models are embedded in the intializers
all the initializers are managers