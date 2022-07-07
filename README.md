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

# Docker Setup

Docker Desktop should be installed (but not necessary).

Kubernetes should be enabled in Docker Desktop.

The context for Kubernetes should be set to the Digital Ocean cluster that was created via doctl. Digital Ocean will walk you through how to create and update the context of your cluster, the command will look something like `doctl kubernetes cluster kubeconfig save <cluster name>`

You should have a DockerHub account where you can push images. This will be important for the GitHub Actions that get triggered on build jobs.

# GitHub Setup

All of the GitHub Actions that start with 'deploy-' should be reviewed (except the manifests deployment) and updated to ensure that the correct DockerHub username is included instead of mine.

There is a ticketing-common submodule that **does not** need to be included in the project. This module is stored on NPM and will be installed during the `npm install` step.
