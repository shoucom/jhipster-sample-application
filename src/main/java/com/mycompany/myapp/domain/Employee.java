package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Employee.
 */
@Entity
@Table(name = "employee")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Employee implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "pin")
    private Long pin;

    @Column(name = "email")
    private String email;

    @Column(name = "phone")
    private Long phone;

    @ManyToOne
    @JsonIgnoreProperties(value = { "employees", "attendances", "visits" }, allowSetters = true)
    private Office office;

    @OneToMany(mappedBy = "employee")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "employee", "office" }, allowSetters = true)
    private Set<Attendance> attendances = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Employee id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Employee name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getPin() {
        return this.pin;
    }

    public Employee pin(Long pin) {
        this.setPin(pin);
        return this;
    }

    public void setPin(Long pin) {
        this.pin = pin;
    }

    public String getEmail() {
        return this.email;
    }

    public Employee email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getPhone() {
        return this.phone;
    }

    public Employee phone(Long phone) {
        this.setPhone(phone);
        return this;
    }

    public void setPhone(Long phone) {
        this.phone = phone;
    }

    public Office getOffice() {
        return this.office;
    }

    public void setOffice(Office office) {
        this.office = office;
    }

    public Employee office(Office office) {
        this.setOffice(office);
        return this;
    }

    public Set<Attendance> getAttendances() {
        return this.attendances;
    }

    public void setAttendances(Set<Attendance> attendances) {
        if (this.attendances != null) {
            this.attendances.forEach(i -> i.setEmployee(null));
        }
        if (attendances != null) {
            attendances.forEach(i -> i.setEmployee(this));
        }
        this.attendances = attendances;
    }

    public Employee attendances(Set<Attendance> attendances) {
        this.setAttendances(attendances);
        return this;
    }

    public Employee addAttendance(Attendance attendance) {
        this.attendances.add(attendance);
        attendance.setEmployee(this);
        return this;
    }

    public Employee removeAttendance(Attendance attendance) {
        this.attendances.remove(attendance);
        attendance.setEmployee(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Employee)) {
            return false;
        }
        return id != null && id.equals(((Employee) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Employee{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", pin=" + getPin() +
            ", email='" + getEmail() + "'" +
            ", phone=" + getPhone() +
            "}";
    }
}
