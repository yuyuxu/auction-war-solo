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
  * game: since game is embedded in one page and it's a mini app, so it is
      separated out into a folder containing MVC.

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
- '[user id] [function name] [type]: [log content]'
- type (optional): '', 'error/err', 'warning'

Back end logging:
- Log routing behavior and general data flow in the back end.

Front end logging:
- Log user general page behavior.
- Log user in game page behavior.

###### Game page
- Item locations format: {category: [list of integer]}
- Actions: 'submit', 'accept'
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

### How to config AWS EC2 and put the app on it
* Get AWS account.

* Follow instruction to launch a EC2 instance (use AMI Linux 64 bit). Note you will create a new *.pem key pair, save it.

* Connect to EC2 instance. On windows, download PuTTY and follow this:
https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/putty.html?icmpid=docs_ec2_console
Basically, first convert *.pem key pair to *.ppk (SSH-2 RSA). Then create a session in PuTTY use that *.ppk, connect to ec2-user@PublicDNS(of the ec2 instance), port number 22.

* Once connected into ec2 ssh, install default packages as mentioned in the terminal. Install git. Then install node js:
https://gist.github.com/douglascorrea/b81b11f8bbf8e6c45cd5

* Run node js. Note now from outside you still might have troubling connecting to your node app. In this case, go to security group, change both inbounds and outbounds to allow all traffic.
