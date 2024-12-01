# PM2
coomand to be written 
pm2 start ecosystem.json

processes of each service is separate 

pm2 restart app-sr1 --env APP_ENV=helloUpdated
[PM2][ERROR] Using --env [env] without passing the ecosystem.config.js does not work


   "env_production": {} under env is created to hanle production env




To integrate the PM2 ecosystem configuration files into an Ansible playbook, you can automate the process of managing and deploying the ecosystem.config.js file, including the environment-specific configurations for each app (app-sr1 and app-sr2). Ansible can be used to create, manage, and deploy these configuration files to your target servers.

Here’s how you can structure your Ansible playbook to handle this:

Steps to Achieve This
Prepare the File Templates: Use Ansible’s template module to manage dynamic configuration files (like ecosystem.config.js, app-sr1.config.js, and app-sr2.config.js).
Configure the File Paths: Store these files either directly in your project or in a version-controlled location.
Run PM2 Commands: Use Ansible to execute the necessary PM2 commands (like pm2 start, pm2 restart, etc.) after the files are copied.
Example Workflow:
Step 1: Prepare Templates for Configuration Files
You’ll need to create Jinja2 templates for your configuration files so that Ansible can populate the environment variables and app-specific information dynamically.

Create app-sr1.config.js Template (app-sr1.config.js.j2):
Create the template file app-sr1.config.js.j2 (with .j2 indicating it's a Jinja2 template):

js
Copy code
module.exports = {
  name: '{{ app_sr1_name }}',
  script: '{{ app_sr1_script }}',
  env: {
    APP_ENV: '{{ app_sr1_env }}'
  }
};
In this template, the placeholders (like {{ app_sr1_name }}) will be replaced with values you define in your Ansible playbook.

Create app-sr2.config.js Template (app-sr2.config.js.j2):
Similarly, create a template for app-sr2.config.js.j2:

js
Copy code
module.exports = {
  name: '{{ app_sr2_name }}',
  script: '{{ app_sr2_script }}',
  env: {
    APP_ENV: '{{ app_sr2_env }}'
  }
};
Step 2: Define the ecosystem.config.js Template (ecosystem.config.js.j2)
Create the ecosystem.config.js.j2 template, which will combine both the app-sr1 and app-sr2 configurations:

js
Copy code
const appSr1 = require('./app-sr1.config');
const appSr2 = require('./app-sr2.config');

module.exports = {
  apps: [appSr1, appSr2]
};
Step 3: Write the Ansible Playbook
Now, in your Ansible playbook, you can define the variables that will replace the placeholders in the templates and then use the template module to create the necessary files.

Here’s an example playbook.yml:

yaml
Copy code
---
- name: Deploy PM2 Configuration
  hosts: your_target_servers
  become: yes  # Optional, if you need root privileges
  vars:
    app_sr1_name: "app-sr1"
    app_sr1_script: "sr1/index.js"
    app_sr1_env: "hello"
    
    app_sr2_name: "app-sr2"
    app_sr2_script: "sr2/index.js"
    app_sr2_env: "world"
    
    # The path where the files should be created on the remote server
    pm2_config_path: "/home/your_user/pm2/config"
    
  tasks:
    - name: Ensure PM2 config directory exists
      file:
        path: "{{ pm2_config_path }}"
        state: directory
        mode: '0755'

    - name: Create app-sr1.config.js from template
      template:
        src: app-sr1.config.js.j2
        dest: "{{ pm2_config_path }}/app-sr1.config.js"

    - name: Create app-sr2.config.js from template
      template:
        src: app-sr2.config.js.j2
        dest: "{{ pm2_config_path }}/app-sr2.config.js"

    - name: Create ecosystem.config.js from template
      template:
        src: ecosystem.config.js.j2
        dest: "{{ pm2_config_path }}/ecosystem.config.js"

    - name: Install PM2 dependencies (if needed)
      command: npm install -g pm2

    - name: Start the PM2 applications
      command: pm2 start "{{ pm2_config_path }}/ecosystem.config.js"
      become: true
Explanation of the Playbook:
Variables: Define variables like app_sr1_name, app_sr1_script, and app_sr1_env that will be injected into the templates.
Ensure Directory: Use the file module to ensure that the directory where the PM2 configuration files will reside exists on the target machine.
Template Module: Use the template module to create app-sr1.config.js, app-sr2.config.js, and ecosystem.config.js on the target machine from their respective Jinja2 templates.
PM2 Installation: Ensure PM2 is installed globally if it’s not already.
Start PM2: Use the pm2 start command to start the applications using the generated ecosystem.config.js file.
Step 4: Run the Playbook
Run your Ansible playbook with the following command:

bash
Copy code
ansible-playbook -i hosts playbook.yml
Make sure to replace your_target_servers with your actual inventory or a group of target servers, and ensure that the hosts file points to the correct server.

Conclusion
By using Ansible's template module, you can easily manage and deploy the PM2 configuration files across multiple servers. The key steps include:

Using Jinja2 templates for app-sr1.config.js, app-sr2.config.js, and ecosystem.config.js.
Populating these templates with dynamic values using Ansible variables.
Running PM2 commands from Ansible to start or restart applications on the target server.
This solution ensures that you can automate the deployment of your PM2 configuration using Ansible, keeping things modular and maintainable. Let me know if you need further assistance!