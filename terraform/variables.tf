variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
}

variable "location" {
  description = "Azure region to deploy the resources"
  type        = string
  default     = "Australia East"
}

variable "cluster_name" {
  description = "Name of the AKS cluster"
  type        = string
}

variable "ssh_public_key" {
  description = "SSH public key for AKS nodes"
  type        = string
}
