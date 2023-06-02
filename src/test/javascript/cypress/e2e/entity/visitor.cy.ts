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

describe('Visitor e2e test', () => {
  const visitorPageUrl = '/visitor';
  const visitorPageUrlPattern = new RegExp('/visitor(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const visitorSample = {};

  let visitor;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/visitors+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/visitors').as('postEntityRequest');
    cy.intercept('DELETE', '/api/visitors/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (visitor) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/visitors/${visitor.id}`,
      }).then(() => {
        visitor = undefined;
      });
    }
  });

  it('Visitors menu should load Visitors page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('visitor');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Visitor').should('exist');
    cy.url().should('match', visitorPageUrlPattern);
  });

  describe('Visitor page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(visitorPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Visitor page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/visitor/new$'));
        cy.getEntityCreateUpdateHeading('Visitor');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', visitorPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/visitors',
          body: visitorSample,
        }).then(({ body }) => {
          visitor = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/visitors+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              body: [visitor],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(visitorPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Visitor page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('visitor');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', visitorPageUrlPattern);
      });

      it('edit button click should load edit Visitor page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Visitor');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', visitorPageUrlPattern);
      });

      it('edit button click should load edit Visitor page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Visitor');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', visitorPageUrlPattern);
      });

      it('last delete button click should delete instance of Visitor', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('visitor').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', visitorPageUrlPattern);

        visitor = undefined;
      });
    });
  });

  describe('new Visitor page', () => {
    beforeEach(() => {
      cy.visit(`${visitorPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Visitor');
    });

    it('should create an instance of Visitor', () => {
      cy.get(`[data-cy="name"]`).type('Strategist analyzing functionalities').should('have.value', 'Strategist analyzing functionalities');

      cy.get(`[data-cy="email"]`).type('Jordi_Wuckert28@gmail.com').should('have.value', 'Jordi_Wuckert28@gmail.com');

      cy.get(`[data-cy="phone"]`).type('61159').should('have.value', '61159');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        visitor = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', visitorPageUrlPattern);
    });
  });
});
