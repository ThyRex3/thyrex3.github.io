---
layout: post
title: Migrating Jenkins Credentials
categories: jenkins
author: Thy Dai
---
1. Stop Jenkins on new server.

       new-server # /etc/init.d/jenkins stop

1. Remove the identity.key.enc file on new server:

       new-server # rm identity.key.enc

1. Copy secret* and credentials.xml to new server.

       current-server # cd /var/lib/jenkins
       current-server # tar czvf /tmp/credentials.tgz secret* credentials.xml
       current-server # scp credentials.tgz $user@$new-server:/tmp/
       new-server # cd /var/lib/jenkins
       new-server # tar xzvf /tmp/credentials.tgz -C ./

1. Start Jenkins.

       new-server # /etc/init.d/jenkins start
       
## Credits/Found
[Jenkins Migrating Credentials](https://itsecureadmin.com/2018/03/26/jenkins-migrating-credentials/)
