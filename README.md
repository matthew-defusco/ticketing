# Deployment Instructions

In order for this app to work, you will need to create a [Digital Ocean](https://www.digitalocean.com/) account and create a Kubernetes cluster there. The default Droplets that are assigned were too small for me - I upgraded to 4 shared CPUs and that seemed to do the trick.

You will also want to make sure that ingress-nginx is installed properly for Digital Ocean: https://kubernetes.github.io/ingress-nginx/deploy/#digital-ocean

A domain name will need to be purchased as well. Once that domain is procured, the following steps should be taken:

- The infra/k8s-prod/ingress-srv.yaml file should be updated on line 10 and 54.
- On the Networking area of Digital Ocean, add the new domain.
  - Make sure that the domain provider has Nameserver DNS entries for:
    - ns1.digitalocean.com
    - ns2.digitalocean.com
    - ns3.digitalocean.com
  - Add a new A record and CNAME record in Digital Ocean to configure the domain behavior.
