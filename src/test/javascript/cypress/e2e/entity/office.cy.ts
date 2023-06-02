import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Office e2e test', () => {
  const officePageUrl = '/office';
  const officePageUrlPattern = new RegExp('/office(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const officeSample = {};

  let office;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/offices+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/offices').as('postEntityRequest');
    cy.intercept('DELETE', '/api/offices/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (office) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/offices/${office.id}`,
      }).then(() => {
        office = undefined;
      });
    }
  });

  it('Offices menu should load Offices page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('office');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Office').should('exist');
    cy.url().should('match', officePageUrlPattern);
  });

  describe('Office page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(officePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Office page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/office/new$'));
        cy.getEntityCreateUpdateHeading('Office');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', officePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/offices',
          body: officeSample,
        }).then(({ body }) => {
          office = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/offices+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [office],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(officePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Office page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('office');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', officePageUrlPattern);
      });

      it('edit button click should load edit Office page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Office');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', officePageUrlPattern);
      });

      it('edit button click should load edit Office page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Office');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', officePageUrlPattern);
      });

      it('last delete button click should delete instance of Office', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('office').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', officePageUrlPattern);

        office = undefined;
      });
    });
  });

  describe('new Office page', () => {
    beforeEach(() => {
      cy.visit(`${officePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Office');
    });

    it('should create an instance of Office', () => {
      cy.get(`[data-cy="name"]`).type('neural-net').should('have.value', 'neural-net');

      cy.get(`[data-cy="address"]`).type('Chips Research').should('have.value', 'Chips Research');

      cy.get(`[data-cy="timeZone"]`).type('Accountability').should('have.value', 'Accountability');

      cy.get(`[data-cy="wifiPassword"]`).type('transmitter').should('have.value', 'transmitter');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        office = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', officePageUrlPattern);
    });
  });
});
