package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Office.
 */
@Entity
@Table(name = "office")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Office implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "address")
    private String address;

    @Column(name = "time_zone")
    private String timeZone;

    @Column(name = "wifi_password")
    private String wifiPassword;

    @OneToMany(mappedBy = "office")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "office", "attendances" }, allowSetters = true)
    private Set<Employee> employees = new HashSet<>();

    @OneToMany(mappedBy = "office")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "employee", "office" }, allowSetters = true)
    private Set<Attendance> attendances = new HashSet<>();

    @OneToMany(mappedBy = "office")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "visitor", "office", "host" }, allowSetters = true)
    private Set<Visit> visits = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Office id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Office name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getAddress() {
        return this.address;
    }

    public Office address(String address) {
        this.setAddress(address);
        return this;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getTimeZone() {
        return this.timeZone;
    }

    public Office timeZone(String timeZone) {
        this.setTimeZone(timeZone);
        return this;
    }

    public void setTimeZone(String timeZone) {
        this.timeZone = timeZone;
    }

    public String getWifiPassword() {
        return this.wifiPassword;
    }

    public Office wifiPassword(String wifiPassword) {
        this.setWifiPassword(wifiPassword);
        return this;
    }

    public void setWifiPassword(String wifiPassword) {
        this.wifiPassword = wifiPassword;
    }

    public Set<Employee> getEmployees() {
        return this.employees;
    }

    public void setEmployees(Set<Employee> employees) {
        if (this.employees != null) {
            this.employees.forEach(i -> i.setOffice(null));
        }
        if (employees != null) {
            employees.forEach(i -> i.setOffice(this));
        }
        this.employees = employees;
    }

    public Office employees(Set<Employee> employees) {
        this.setEmployees(employees);
        return this;
    }

    public Office addEmployee(Employee employee) {
        this.employees.add(employee);
        employee.setOffice(this);
        return this;
    }

    public Office removeEmployee(Employee employee) {
        this.employees.remove(employee);
        employee.setOffice(null);
        return this;
    }

    public Set<Attendance> getAttendances() {
        return this.attendances;
    }

    public void setAttendances(Set<Attendance> attendances) {
        if (this.attendances != null) {
            this.attendances.forEach(i -> i.setOffice(null));
        }
        if (attendances != null) {
            attendances.forEach(i -> i.setOffice(this));
        }
        this.attendances = attendances;
    }

    public Office attendances(Set<Attendance> attendances) {
        this.setAttendances(attendances);
        return this;
    }

    public Office addAttendance(Attendance attendance) {
        this.attendances.add(attendance);
        attendance.setOffice(this);
        return this;
    }

    public Office removeAttendance(Attendance attendance) {
        this.attendances.remove(attendance);
        attendance.setOffice(null);
        return this;
    }

    public Set<Visit> getVisits() {
        return this.visits;
    }

    public void setVisits(Set<Visit> visits) {
        if (this.visits != null) {
            this.visits.forEach(i -> i.setOffice(null));
        }
        if (visits != null) {
            visits.forEach(i -> i.setOffice(this));
        }
        this.visits = visits;
    }

    public Office visits(Set<Visit> visits) {
        this.setVisits(visits);
        return this;
    }

    public Office addVisit(Visit visit) {
        this.visits.add(visit);
        visit.setOffice(this);
        return this;
    }

    public Office removeVisit(Visit visit) {
        this.visits.remove(visit);
        visit.setOffice(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Office)) {
            return false;
        }
        return id != null && id.equals(((Office) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Office{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", address='" + getAddress() + "'" +
            ", timeZone='" + getTimeZone() + "'" +
            ", wifiPassword='" + getWifiPassword() + "'" +
            "}";
    }
}
