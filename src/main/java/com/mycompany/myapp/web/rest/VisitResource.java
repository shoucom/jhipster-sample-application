package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Visit;
import com.mycompany.myapp.repository.VisitRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Visit}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VisitResource {

    private final Logger log = LoggerFactory.getLogger(VisitResource.class);

    private static final String ENTITY_NAME = "visit";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VisitRepository visitRepository;

    public VisitResource(VisitRepository visitRepository) {
        this.visitRepository = visitRepository;
    }

    /**
     * {@code POST  /visits} : Create a new visit.
     *
     * @param visit the visit to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new visit, or with status {@code 400 (Bad Request)} if the visit has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/visits")
    public ResponseEntity<Visit> createVisit(@RequestBody Visit visit) throws URISyntaxException {
        log.debug("REST request to save Visit : {}", visit);
        if (visit.getId() != null) {
            throw new BadRequestAlertException("A new visit cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Visit result = visitRepository.save(visit);
        return ResponseEntity
            .created(new URI("/api/visits/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /visits/:id} : Updates an existing visit.
     *
     * @param id the id of the visit to save.
     * @param visit the visit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated visit,
     * or with status {@code 400 (Bad Request)} if the visit is not valid,
     * or with status {@code 500 (Internal Server Error)} if the visit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/visits/{id}")
    public ResponseEntity<Visit> updateVisit(@PathVariable(value = "id", required = false) final Long id, @RequestBody Visit visit)
        throws URISyntaxException {
        log.debug("REST request to update Visit : {}, {}", id, visit);
        if (visit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, visit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!visitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Visit result = visitRepository.save(visit);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, visit.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /visits/:id} : Partial updates given fields of an existing visit, field will ignore if it is null
     *
     * @param id the id of the visit to save.
     * @param visit the visit to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated visit,
     * or with status {@code 400 (Bad Request)} if the visit is not valid,
     * or with status {@code 404 (Not Found)} if the visit is not found,
     * or with status {@code 500 (Internal Server Error)} if the visit couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/visits/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Visit> partialUpdateVisit(@PathVariable(value = "id", required = false) final Long id, @RequestBody Visit visit)
        throws URISyntaxException {
        log.debug("REST request to partial update Visit partially : {}, {}", id, visit);
        if (visit.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, visit.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!visitRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Visit> result = visitRepository
            .findById(visit.getId())
            .map(existingVisit -> {
                if (visit.getInTime() != null) {
                    existingVisit.setInTime(visit.getInTime());
                }
                if (visit.getOutTime() != null) {
                    existingVisit.setOutTime(visit.getOutTime());
                }

                return existingVisit;
            })
            .map(visitRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, visit.getId().toString())
        );
    }

    /**
     * {@code GET  /visits} : get all the visits.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of visits in body.
     */
    @GetMapping("/visits")
    public List<Visit> getAllVisits() {
        log.debug("REST request to get all Visits");
        return visitRepository.findAll();
    }

    /**
     * {@code GET  /visits/:id} : get the "id" visit.
     *
     * @param id the id of the visit to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the visit, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/visits/{id}")
    public ResponseEntity<Visit> getVisit(@PathVariable Long id) {
        log.debug("REST request to get Visit : {}", id);
        Optional<Visit> visit = visitRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(visit);
    }

    /**
     * {@code DELETE  /visits/:id} : delete the "id" visit.
     *
     * @param id the id of the visit to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/visits/{id}")
    public ResponseEntity<Void> deleteVisit(@PathVariable Long id) {
        log.debug("REST request to delete Visit : {}", id);
        visitRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
