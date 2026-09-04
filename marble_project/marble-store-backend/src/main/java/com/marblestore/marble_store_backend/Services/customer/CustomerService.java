package com.marblestore.marble_store_backend.Services.customer;

import com.marblestore.marble_store_backend.Model.Customer;
import com.marblestore.marble_store_backend.reposetory.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository repository;

    public CustomerService(CustomerRepository repository) {
        this.repository = repository;
    }

    public List<Customer> getAll() {
        return repository.findAll();
    }

    public Customer save(Customer customer) {
        return repository.save(customer);
    }
}
