<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://pub-dae6836ea721478b89301a8e71d52a33.r2.dev/anon/dev-images/anon_logo-system_white%403x.png">
  <source media="(prefers-color-scheme: light)" srcset="https://pub-dae6836ea721478b89301a8e71d52a33.r2.dev/anon/dev-images/anon_logo-900%403x.png">
  <img alt="Anon" src="https://pub-dae6836ea721478b89301a8e71d52a33.r2.dev/anon/dev-images/anon_logo-900%403x.png">
</picture>

# Actions Demos

To get started, 
1. Add your `ANON_APP_USER_ID` and `ANON_API_KEY` to the `.env` file


2. Install the dependencies.
```sh
npm install
```

3. Run the action
```sh
npm start
```



# Trying different Demos

To try different demos, head over to the index.ts file, and:

1. Change the apps array to include the apps you want to run
``` apps = ["linkedin"] ```

2. Change the action to the action you want to perform
``` action = async (page) => { ... } ```
You can see the available actions by looking through the demos folders, which contain the available actions for each app.

3. Run the action
``` npm start ```
